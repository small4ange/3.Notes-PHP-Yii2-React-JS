<?php

namespace app\controllers;

use yii\web\Controller;
use app\models\Note;
use app\models\NoteTags;
use app\models\NoteFiles;
use app\models\User;
use app\models\UserNotes;
use yii\web\Response;
use Yii;

class ApiController extends Controller
{
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        // return [
        //     'contentNegotiator' => [
        //         'class' => \yii\filters\ContentNegotiator::class,
        //         'formats' => [
        //             'application/json' => Response::FORMAT_JSON,
        //         ],
        //     ],
        // ];
        //return $behaviors;

        //настройка cors для react
        return array_merge(parent::behaviors(), [
            'corsFilter' => [
                'class' => \yii\filters\Cors::class,
                'cors' => [
                    'Origin' => ['http://localhost:5173'],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    'Access-Control-Allow-Credentials' => true,
                    'Access-Control-Max-Age' => 3600,
                    'Access-Control-Request-Headers' => ['*'],
                    'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization'],
                ],
            ],
        ]);
    }
    public function beforeAction($action)
	{
		$this->enableCsrfValidation = false;
		
		\Yii::$app->response->format = Response::FORMAT_JSON;
		
		return parent::beforeAction($action);
	}

    //ответ на POST: создание заметки
    public function actionCreate($userId)
    {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        //проверка пользователя
        $userId = \Yii::$app->request->get('userId');
        if (!$userId) {
            return [
                'status' => 'error',
                'message' => 'Не передан userId',
            ];
        }

        //создание новой заметки
        $note = new Note();
        
        $title = \Yii::$app->request->post('title');
        $text = \Yii::$app->request->post('text');

        // if (empty($title) || empty($text)) {
        //     return [
        //         'status' => 'error',
        //         'message' => 'Заголовок и текст не могут быть пустыми',
        //     ];
        // }

        $note->title = $title;
        $note->note_text = $text;
        
        if ($note->save()) {
            $userNote = new UserNotes();
            $userNote->user_id = $userId;
            $userNote->note_id = $note->id;
            
            if ($userNote->save()){
                $noteTags = json_decode(\Yii::$app->request->post('tags'));
                $noteTagNames = [];
                foreach ($noteTags as $tag) {
                    $noteTag = new NoteTags();
                    $noteTag->tag_name = $tag;
                    $noteTag->note_id = $note->id;
                    $noteTag->save();

                    $noteTagNames[] = $noteTag->tag_name;
                }
                //получение файлов
                $uploadedFiles = \yii\web\UploadedFile::getInstancesByName('files');
                $fileUrls = [];//массив ссылок на файлы

                foreach ($uploadedFiles as $file) {
                    $fileName = uniqid() . '.' . $file->extension;
                    $filePath = \Yii::getAlias('@webroot/uploads/') . $fileName;
                    $fileUrl = "http://localhost/3_тестовое/back/web/api/download-file?fileName={$fileName}";
                    $fileServerPath = '/uploads/' . $fileName;

                    //сохранение файла на сервере
                    if ($file->saveAs($filePath)) {
                        //заполнение модели
                        $noteFile = new NoteFiles();
                        $noteFile->note_id = $note->id;
                        $noteFile->file_name = $file->name;
                        $noteFile->file_url = $fileServerPath;
                        $noteFile->save();

                        $fileUrls[] = [
                            'name' => $file->name,
                            'url' => "http://localhost/3_тестовое/back/web/api/download-file?fileName={$fileName}",
                        ];
                    }
                }
                return [
                    'status' => 'success',
                    'message' => 'Связь заметки с пользователем установлена успешно',
                    'title' => $note->title,
                    'text' => $note->note_text,
                    'id' => $userNote->id,
                    'files' => $fileUrls,
                    'tags' => $noteTagNames,
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Ошибка связи заметки с пользователем',
                    'errors' => $note->errors,
                ];
            }
            
        } else {
            return [
                'status' => 'error',
                'message' => 'Ошибка создания заметки',
                'errors' => $note->errors,
            ];
        }

        

    }

    //регистрация пользователя ответ на post
    public function actionRegister() 
    {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $request = \Yii::$app->request;
        $post = json_decode($request->getRawBody(), true);

        $user = new User();
        $user->email = $post['email'];
        $user->password = $post['password'];

        if($user->save()){
            return [
                'status' => 'success',
                'email' => $user->email,
            ];
        } else {
            return [
                'status' => 'error',
                'errors' => $user->errors,
            ];
        }
    }

    //проверка входа пользователя
    public function actionLogin() {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $request = \Yii::$app->request;
        $post = json_decode($request->getRawBody(), true);

        if ($post === null || !isset($post['email']) || !isset($post['password'])) {
            return [
                'status' => 'error',
                'message' => 'Необходимо указать email и пароль',
            ];
        }

        $user_email = $post['email'];
        $user_password = $post['password'];

        $user = User::findOne(['email' => $user_email, 'password' => $user_password]) ?? null;

        if ($user != null) {
            return [
                'status' => 'success',
                'id' => $user->id,
            ];
        } else {
            return [
                'status' => 'error',
                'errors' => $user->errors,
                'user' => $user,
            ];
        }
    }    
    
    //ответ на GET: получение всех заметок пользователя
    public function actionIndex($user_id)
    {
        $allNotes = Note::find()
        ->innerJoin('user_notes', 'user_notes.note_id = note.id')
        ->where(['user_notes.user_id' => $user_id])
        ->all();

        
        $notesWithFiles = [];
        foreach ($allNotes as $note) {
            $noteTags = NoteTags::find()->where(['note_id' => $note->id])->all();
            $tagsList=[];
            foreach($noteTags as $tag){
                $tagsList[] = [
                    'id' => $tag->id,
                    'tag_name' => $tag->tag_name,
                ];
            }
            $files = NoteFiles::find()
                ->where(['note_id' => $note->id])
                ->all();

            $fileList = [];
            foreach ($files as $file) {
                $fileList[] = [
                    'id' => $file->id,
                    'url' => $file->file_url, //путь к файлу
                    'name' => $file->file_name, //имя файла
                ];
            }

            $notesWithFiles[] = [
                'id' => $note->id,
                'title' => $note->title,
                'note_text' => $note->note_text,
                'files' => $fileList,
                'tags' => $tagsList,
            ];
        }

    return [
        'allNotes' => $notesWithFiles,
    ];
        
    }

    //ответ на PUT: обновление заметки
    public function actionUpdate($id)
    {
        $note = Note::findOne($id);
        if ($note === null) {
            return [
                'status'=>'error',
                'message'=>'Заметка не найдена',
            ];
        }
        $request = \Yii::$app->request;

        $note->title = $request->post('title', $note->title);
        $note->note_text = $request->post('text', $note->note_text);

        $deleteFiles = json_decode($request->post('removedFiles'), true);
        if (!empty($deleteFiles)) {
            foreach ($deleteFiles as $fileId) {
                $noteFile = NoteFiles::findOne($fileId);
                if ($noteFile !== null && $noteFile->note_id == $note->id) {
                    @unlink(\Yii::getAlias('@webroot') . $noteFile->file_url);
                    $noteFile->delete();
                }
            }
        }

        $deletedTags = json_decode($request->post('removedTags'), true);
        if(!empty($deletedTags)) {
            foreach ($deletedTags as $tagId) {
                $noteTag = NoteTags::findOne($tagId);
                if($noteTag !== null && $noteTag->note_id == $note->id) {
                    $noteTag->delete();
                }
            }
        }

        $uploadedFiles = \yii\web\UploadedFile::getInstancesByName('newFiles');
        $fileUrls = [];
        
        foreach ($uploadedFiles as $file) {
            $fileName = uniqid() . '.' . $file->extension;
            $filePath = \Yii::getAlias('@webroot/uploads/') . $fileName;
            $fileUrl = "http://localhost/3_тестовое/back/web/api/download-file?fileName={$fileName}";
            $fileServerPath = '/uploads/' . $fileName;

            //сохранение файла на сервере
            if ($file->saveAs($filePath)) {
                //заполнение модели
                $noteFile = new NoteFiles();
                $noteFile->note_id = $note->id;
                $noteFile->file_name = $file->name;
                $noteFile->file_url = $fileServerPath;
                $noteFile->save();

                $fileUrls[] = [
                    'name' => $file->name,
                    'url' => \Yii::$app->urlManager->createAbsoluteUrl(['api/download-file', 'fileName' => $fileName]),
                ];
            }
            
        }
        $uploadedTags = json_decode($request->post('newTags'), true);
        if (!empty($uploadedTags)) {
            foreach ($uploadedTags as $tagName) {
                $noteTag = new NoteTags();
                $noteTag->tag_name = $tagName;
                $noteTag->note_id = $note->id;
                $noteTag->save();
    
            }
        }
        

        if ($note->save()) {
            return [
                'status' => 'success',
                'message' => 'Заметка обновлена успешно',
                'note' => [
                    'title' => $note->title,
                    'text' => $note->note_text,
                    'files' => $fileUrls,
                    'tags' => $uploadedTags,
                ],
            ];
        }
        return [
            'status' => 'error',
            'errors' => $note->errors,
        ];
    }

    //ответ на DELETE: удаление заметки
    public function actionDelete($id)
    {
        $note = Note::findOne($id);
        
        if ($note === null) {
            return [
                'status' => 'error',
                'message'=>'Заметка не найдена',
            ];
        }

        $noteFiles = NoteFiles::findAll(['note_id' => $id]);
        foreach ($noteFiles as $noteFile) {
            $filePath = \Yii::getAlias('@webroot') . $noteFile->file_url;
            if (file_exists($filePath)) {
                @unlink($filePath);  
            }
            $noteFile->delete(); 
        }

        $noteTags = NoteTags::findAll(['note_id' => $id]);
        foreach ($noteTags as $noteTag) {
            $noteTag->delete();
        }

        $userNote = UserNotes::findOne(['note_id' => $id]);
        if ($userNote !== null) {
            $userNote->delete();
        }

        if ($note->delete()) {
            return ['msg' => 'Note deleted successfully'];
        }
        return ['errors' => $note->errors];
    }

    public function actionGetNote($id) {
        $note = Note::findOne($id);
        if($note===null) {
            return [
                'status' => 'error',
                'message' => 'Заметка не найдена',
            ];
        } 

        return [
            'status' => 'success',
            'note' => [
            'title' => $note->title,
            'text' => $note->note_text,
            ],
        ];
    }

    //получение файла с сервера
    public function actionDownloadFile($fileName)
    {

        $noteFile = NoteFiles::findOne(['file_url' => "/uploads/{$fileName}"]);
        if ($noteFile === null) {
            throw new \yii\web\NotFoundHttpException("Файл не найден.");
        }

        $filePath = \Yii::getAlias('@webroot/uploads/') . $fileName;

        if (file_exists($filePath)) {
            return \Yii::$app->response->sendFile($filePath, $noteFile->file_name, [
                'mimeType' => mime_content_type($filePath),
                'inline' => false,
            ]);
        } else {
            throw new \yii\web\NotFoundHttpException('Файл не найден.');
        }
    }
}


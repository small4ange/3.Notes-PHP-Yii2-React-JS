<?php

namespace app\controllers;

use yii\web\Controller;
use app\models\Note;
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
        return $behaviors;
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
        $request = \Yii::$app->request;

        $post = json_decode($request->getRawBody(), true);

        // $userId = $post['user_id'] ?? null;

        // if (!isset($post['user_id'])) {
        //     return [
        //         'status' => 'error',
        //         'message' => 'user_id не передан',
        //     ];
        // }
        $note = new Note();
        
        $note->title = $post['title'] ?? '';
        $note->note_text = $post['text'] ?? '';

        if ($note->save()) {
            $userNote = new UserNotes();
            $userNote->user_id = $userId;
            $userNote->note_id = $note->id;
            
            if ($userNote->save()){
                return [
                    'status' => 'success',
                    'title' => $note->title,
                    'text' => $note->note_text,
                    'id' => $userNote->id,
                ];
            }
            
        } else {
            return [
                'status' => 'error',
                'message' => 'Ошибка связи заметки с пользователем',
                'errors' => $note->errors,
            ];
        }

        return [
            'status' => 'error',
            'message' => 'Ошибка создания заметки',
            'errors' => $note->errors,
        ];

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
    //тест
    public function actionTest()
    {
        return [
            'msg' => 'api test ok',
        ];
    }
    
    
    //ответ на GET: получение всех заметок пользователя
    public function actionIndex($user_id)
    {
        $allNotes = Note::find()
        ->innerJoin('user_notes', 'user_notes.note_id = note.id')
        ->where(['user_notes.user_id' => $user_id])
        ->all();

        return[
            'allNotes' => $allNotes,
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

        $data = json_decode($request->getRawBody(), true);
        $note->title = $data['title'] ?? $note->title;
        $note->note_text = $data['text'] ?? $note->note_text;
        if ($note->save()) {
            return [
                'status' => 'success',
                'message' => 'Заметка обновлена успешно',
                'note' => [
                    'title' => $note->title,
                    'text' => $note->note_text,
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
                'msg'=>'404 заметка не найдена',
            ];
        }

        $userNote = UserNotes::findOne(['note_id' => $id]);
        $userNote->delete();
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
}


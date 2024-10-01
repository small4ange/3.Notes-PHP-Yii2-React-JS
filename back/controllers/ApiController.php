<?php

namespace app\controllers;

use yii\web\Controller;
use app\models\Note;
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
    public function actionCreate()
    {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $request = \Yii::$app->request;

        $post = json_decode($request->getRawBody(), true);

        $note = new Note();
        
        $note->title = $post['title'] ?? '';
        $note->note_text = $post['text'] ?? 'пустой текст';

        if ($note->save()) {
            return [
                'status' => 'success',
                'title' => $note->title,
                'text' => $note->note_text,
            ];
        } else {
            return [
                'status' => 'error',
                'errors' => $note->errors,
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
    

    //ответ на GET: получение всех заметок
    public function actionIndex()
    {
        $allNotes = Note::find()->orderBy('date')->all();
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
                'msg'=>'404',
            ];
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
}


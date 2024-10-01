<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;

class TestController extends \yii\web\Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }
    public function actionDbCheck()
{
    \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

    try {
        $db = Yii::$app->db;
        $command = $db->createCommand('SELECT 1');
        $result = $command->queryScalar();

        return [
            'status' => 'success',
            'message' => 'Подключение к базе данных успешно!',
            'result' => $result,
        ];
    } catch (\Exception $e) {
        return [
            'status' => 'error',
            'message' => 'Ошибка подключения: ' . $e->getMessage(),
        ];
    }
}

}

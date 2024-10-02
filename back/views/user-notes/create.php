<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var app\models\UserNotes $model */

$this->title = Yii::t('app', 'Create User Notes');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'User Notes'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-notes-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>

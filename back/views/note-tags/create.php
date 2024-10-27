<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var app\models\NoteTags $model */

$this->title = Yii::t('app', 'Create Note Tags');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Note Tags'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="note-tags-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>

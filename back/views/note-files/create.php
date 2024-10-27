<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var app\models\NoteFiles $model */

$this->title = Yii::t('app', 'Create Note Files');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Note Files'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="note-files-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>

<?php

/** @var yii\web\View $this */
/** @var $msg1 */
/** @var $msg2 */

use yii\helpers\Html;

$this->title = 'About';

$this->params['breadcrumbs'][] = $this->title;

?>

<div class="site-about">
    
    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        This is the About page. You may modify the following file to customize its content:
    </p>
    
    <p><b>msg 1 = <?php echo $msg1 ?></b></p>
    <p><b>msg 2 = <?php echo $msg2 ?></b></p>

    <code><?= __FILE__ ?></code>
    
</div>
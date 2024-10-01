<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "note".
 *
 * @property int $id
 * @property string|null $note_text
 * @property string|null $title
 *
 * @property UserNotes[] $userNotes
 */
class Note extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'note';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['note_text'], 'string'],
            [['title'], 'string', 'max' => 1000],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'note_text' => Yii::t('app', 'Note Text'),
            'title' => Yii::t('app', 'Title'),
        ];
    }

    /**
     * Gets query for [[UserNotes]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUserNotes()
    {
        return $this->hasMany(UserNotes::class, ['note_id' => 'id']);
    }
}

<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "note_tags".
 *
 * @property int $id
 * @property string $tag_name
 * @property int $note_id
 *
 * @property Note $note
 */
class NoteTags extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'note_tags';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['tag_name', 'note_id'], 'required'],
            [['note_id'], 'integer'],
            [['tag_name'], 'string', 'max' => 200],
            [['note_id'], 'exist', 'skipOnError' => true, 'targetClass' => Note::class, 'targetAttribute' => ['note_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'tag_name' => Yii::t('app', 'Tag Name'),
            'note_id' => Yii::t('app', 'Note ID'),
        ];
    }

    /**
     * Gets query for [[Note]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getNote()
    {
        return $this->hasOne(Note::class, ['id' => 'note_id']);
    }
}

<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "note_files".
 *
 * @property int $id
 * @property int $note_id
 * @property string|null $file_name
 * @property string|null $file_url
 *
 * @property Note $note
 */
class NoteFiles extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'note_files';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['note_id'], 'required'],
            [['note_id'], 'integer'],
            [['file_name', 'file_url'], 'string', 'max' => 255],
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
            'note_id' => Yii::t('app', 'Note ID'),
            'file_name' => Yii::t('app', 'File Name'),
            'file_url' => Yii::t('app', 'File Url'),
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

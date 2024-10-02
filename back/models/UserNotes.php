<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "user_notes".
 *
 * @property int $id
 * @property int|null $user_id
 * @property int|null $note_id
 *
 * @property Note $note
 * @property User $user
 */
class UserNotes extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'user_notes';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['user_id', 'note_id'], 'integer'],
            [['note_id'], 'exist', 'skipOnError' => true, 'targetClass' => Note::class, 'targetAttribute' => ['note_id' => 'id']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'user_id' => Yii::t('app', 'User ID'),
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

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}

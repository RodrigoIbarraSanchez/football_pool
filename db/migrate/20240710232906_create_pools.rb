class CreatePools < ActiveRecord::Migration[7.1]
  def change
    create_table :pools do |t|
      t.string :title
      t.string :description
      t.string :raffle_winner
      t.boolean :isStarted
      t.boolean :isFinished
      t.string :prize
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

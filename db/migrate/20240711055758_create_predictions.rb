class CreatePredictions < ActiveRecord::Migration[7.1]
  def change
    create_table :predictions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :pool, null: false, foreign_key: true
      t.references :match, null: false, foreign_key: true
      t.integer :home_team_score
      t.integer :away_team_score

      t.timestamps
    end
  end
end

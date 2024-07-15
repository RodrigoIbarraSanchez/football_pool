class CreateMatches < ActiveRecord::Migration[7.1]
  def change
    create_table :matches do |t|
      t.integer :fixture_id
      t.string :home_team
      t.string :away_team
      t.datetime :date
      t.string :venue
      t.string :city
      t.string :round
      t.integer :league_id
      t.string :status
      t.integer :elapsed
      t.string :home_team_logo
      t.string :away_team_logo

      t.timestamps
    end
  end
end

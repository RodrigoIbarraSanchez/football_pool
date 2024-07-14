class CreateMatches < ActiveRecord::Migration[7.1]
  def change
    create_table :matches do |t|
      t.string :home_team
      t.string :away_team
      t.datetime :match_date

      t.timestamps
    end
  end
end

class AddFieldsToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :home_team, :string
    add_column :matches, :away_team, :string
    add_column :matches, :date, :datetime
    add_column :matches, :venue, :string
    add_column :matches, :city, :string
    add_column :matches, :round, :string
    add_column :matches, :league_id, :integer
  end
end

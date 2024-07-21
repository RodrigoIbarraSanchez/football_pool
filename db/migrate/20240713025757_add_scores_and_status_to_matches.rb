class AddScoresAndStatusToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :home_team_score, :integer
    add_column :matches, :away_team_score, :integer
    add_column :matches, :elapsed, :integer unless column_exists?(:matches, :elapsed)
  end
end

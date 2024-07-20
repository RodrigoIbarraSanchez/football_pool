class AddPointsToPredictions < ActiveRecord::Migration[7.1]
  def change
    unless column_exists?(:predictions, :points)
      add_column :predictions, :points, :integer
    end
  end
end

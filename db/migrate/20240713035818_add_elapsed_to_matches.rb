class AddElapsedToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :elapsed, :integer unless column_exists?(:matches, :elapsed)
  end
end

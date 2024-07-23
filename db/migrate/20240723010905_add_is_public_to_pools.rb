class AddIsPublicToPools < ActiveRecord::Migration[7.1]
  def change
    add_column :pools, :isPublic, :boolean, default: false
  end
end

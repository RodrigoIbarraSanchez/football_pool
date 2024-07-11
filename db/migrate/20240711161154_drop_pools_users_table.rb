class DropPoolsUsersTable < ActiveRecord::Migration[7.1]
  def change
    drop_table :pools_users, if_exists: true
  end
end

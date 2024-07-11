class CreatePoolsUsersJoinTable < ActiveRecord::Migration[7.1]
  def change
    create_join_table :pools, :users do |t|
      t.index [:pool_id]
      t.index [:user_id]
    end
  end
end

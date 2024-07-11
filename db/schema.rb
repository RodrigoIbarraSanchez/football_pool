# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_07_11_035359) do
  create_table "matches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "home_team"
    t.string "away_team"
    t.datetime "date"
    t.string "venue"
    t.string "city"
    t.string "round"
    t.integer "league_id"
    t.integer "fixture_id", null: false
    t.index ["fixture_id"], name: "index_matches_on_fixture_id", unique: true
  end

  create_table "matches_pools", id: false, force: :cascade do |t|
    t.integer "pool_id", null: false
    t.integer "match_id", null: false
    t.index ["match_id", "pool_id"], name: "index_matches_pools_on_match_id_and_pool_id"
    t.index ["pool_id", "match_id"], name: "index_matches_pools_on_pool_id_and_match_id"
  end

  create_table "pools", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "raffle_winner"
    t.boolean "isStarted"
    t.boolean "isFinished"
    t.string "prize"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_pools_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "pools", "users"
end

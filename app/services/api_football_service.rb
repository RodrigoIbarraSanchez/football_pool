# app/services/api_football_service.rb
require 'httparty'

class ApiFootballService
  include HTTParty
  base_uri 'https://v3.football.api-sports.io'

  def initialize
    @headers = {
      "x-apisports-key" => ENV['API_FOOTBALL_KEY']
    }
  end

  def fixtures(season, from, to, league)
    self.class.get("/fixtures", headers: @headers, query: { season: season, from: from, to: to, league: league })
  end

  def save_fixtures(season, from, to, league)
    response = fixtures(season, from, to, league)
    if response["response"].present?
      response["response"].each do |fixture_data|
        Match.find_or_create_by!(fixture_id: fixture_data["fixture"]["id"]) do |match|
          match.home_team = fixture_data["teams"]["home"]["name"]
          match.away_team = fixture_data["teams"]["away"]["name"]
          match.date = fixture_data["fixture"]["date"]
          match.venue = fixture_data["fixture"]["venue"]["name"]
          match.city = fixture_data["fixture"]["venue"]["city"]
          match.round = fixture_data["league"]["round"]
          match.league_id = fixture_data["league"]["id"]
        end
      end
    end
  end
end

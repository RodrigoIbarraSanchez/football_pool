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
          match.home_team_logo = fixture_data["teams"]["home"]["logo"]
          match.away_team = fixture_data["teams"]["away"]["name"]
          match.away_team_logo = fixture_data["teams"]["away"]["logo"]
          match.date = fixture_data["fixture"]["date"]
          match.venue = fixture_data["fixture"]["venue"]["name"]
          match.city = fixture_data["fixture"]["venue"]["city"]
          match.round = fixture_data["league"]["round"]
          match.league_id = fixture_data["league"]["id"]
        end
      end
    end
  end

  def update_fixture(fixture_id)
    response = self.class.get("/fixtures", headers: @headers, query: { id: fixture_id })
    fixture_data = response["response"].first

    if fixture_data.present?
      match = Match.find_by(fixture_id: fixture_id)
      if match
        match.update!(
          home_team_score: fixture_data["goals"]["home"],
          away_team_score: fixture_data["goals"]["away"],
          status: fixture_data["fixture"]["status"]["short"],
          elapsed: fixture_data["fixture"]["status"]["elapsed"],
          home_team_logo: fixture_data["teams"]["home"]["logo"],
          away_team_logo: fixture_data["teams"]["away"]["logo"]
        )
        Rails.logger.debug "Match updated: #{match.inspect}"
      else
        Rails.logger.debug "Match not found for fixture_id: #{fixture_id}"
      end
    else
      Rails.logger.debug "No fixture data found for fixture_id: #{fixture_id}"
    end
  end

  def update_live_fixtures
    response = self.class.get("/fixtures/live", headers: @headers)
    fixtures = response["response"]

    fixtures.each do |fixture_data|
      match = Match.find_by(fixture_id: fixture_data["fixture"]["id"])
      if match
        match.update!(
          home_team_score: fixture_data["goals"]["home"],
          away_team_score: fixture_data["goals"]["away"],
          status: fixture_data["fixture"]["status"]["short"],
          elapsed: fixture_data["fixture"]["status"]["elapsed"],
          home_team_logo: fixture_data["teams"]["home"]["logo"],
          away_team_logo: fixture_data["teams"]["away"]["logo"]
        )
        Rails.logger.debug "Live match updated: #{match.inspect}"
      else
        Rails.logger.debug "Live match not found for fixture_id: #{fixture_data["fixture"]["id"]}"
      end
    end
  end
end

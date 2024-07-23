class MatchesController < ApplicationController
  def current_round
    @matches = get_current_round_matches
  end

  private

  def get_current_round_matches
    service = ApiFootballService.new
    season = 2024
    from = Date.today
    to = from + (7 - from.wday) # Obtener el próximo domingo
    league = 772
    response = service.fixtures(season, from, to, league)

    # Verificar que la respuesta contenga datos
    if response["response"].present?
      current_round = response["response"].first.dig("league", "round")
      response["response"].select { |match| match.dig("league", "round") == current_round }
    else
      []
    end
  end
end

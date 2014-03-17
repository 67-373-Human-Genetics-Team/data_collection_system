json.array!(@surveys) do |survey|
  json.extract! survey, :id, :name, :status
  json.url survey_url(survey, format: :json)
end

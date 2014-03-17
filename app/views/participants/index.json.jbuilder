json.array!(@participants) do |participant|
  json.extract! participant, :id, :first_name, :last_name, :email, :started_at, :datetime, :completed_at
  json.url participant_url(participant, format: :json)
end

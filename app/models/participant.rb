class Participant < ActiveRecord::Base
	# Relationships
	has_many :answers
	has_many :questions, through: :answers
end

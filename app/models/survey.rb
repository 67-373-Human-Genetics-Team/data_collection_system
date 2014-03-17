class Survey < ActiveRecord::Base
	# Relationships
	has_many :questions

	accepts_nested_attributes_for :questions
end

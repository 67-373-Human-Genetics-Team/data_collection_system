class Question < ActiveRecord::Base
  # Relationships
  belongs_to :survey
  has_many :answers
  has_many :participants, through: :answers
end

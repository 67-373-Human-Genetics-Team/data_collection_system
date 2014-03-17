class CreateParticipants < ActiveRecord::Migration
  def change
    create_table :participants do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :started_at
      t.string :datetime
      t.datetime :completed_at

      t.timestamps
    end
  end
end

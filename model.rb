require 'dm-core'

DataMapper.setup(:default, :adapter => :sqlite3, :database => "db/#{Sinatra::Application.environment}.sqlite3")

class Profile
  include DataMapper::Resource

  property :id,           String, :key => true
  property :display_name, String
  property :profile_url,  String

  has n, :interests
  has n, :marked_profiles, :through => :interests,
         :remote_name => :interested_in,
         :class_name => "Profile", :child_key => [:profile_id]
  has n, :marked_by, :through => :interests,
         :remote_name => :profile,
         :class_name => "Profile", :child_key => [:interested_in_id]
end

class Interest
  include DataMapper::Resource

  property :profile_id,       String, :key => true
  property :interested_in_id, String, :key => true

  belongs_to :profile, :child_key => [:profile_id]
  belongs_to :interested_in, :child_key => [:interested_in_id], :class_name => "Profile"
end

DataMapper.auto_upgrade!

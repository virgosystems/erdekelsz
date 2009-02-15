### Application deployment setup

set :application,         "erdekelsz"
set :repository,          "git@ruby.virgo.private:erdekelsz.git"
set :scm,                 :git

set :keep_releases,       5
set :user,                "deployer"
set :runner,              user
set :use_sudo,            false
set :deploy_to,           "/srv/apps/#{application}"
set :deploy_via,          :remote_cache


### Environment specific settings

# We only have one environment now
#task :production do
  set :domain, 'ruby1-test.dmz.virgo.private'
  role :web, :domain
  role :app, :domain
  role :db , :domain, :primary => true

  set :rack_env, "production"
#end


after "deploy", "deploy:cleanup"
after "deploy:migrations" , "deploy:cleanup"


namespace :deploy do
  %w(start restart).each do |action|
    desc "Let Phusion Passenger #{action} the processes"
    task action.to_sym, :roles => :app do
      passenger.restart
    end
  end

  desc "Stop task is a no-op with Phusion Passenger"
  task :stop, :roles => :app do ; end
end

namespace :passenger do
  desc "Restart Application"
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

require 'ostruct'

Gadget = OpenStruct.new(YAML.load_file(File.join(Sinatra::Application.root, 'config', 'gadget.yml'))[Sinatra::Application.environment.to_s])

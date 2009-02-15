require 'ostruct'

Gadget = OpenStruct.new(YAML.load_file(File.join(File.dirname(__FILE__), 'config', 'gadget.yml'))[Sinatra::Application.environment.to_s])

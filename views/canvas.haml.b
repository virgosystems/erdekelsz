%html
  %head
    %link{:rel => "stylesheet", :type => "text/css", :href => "/screen.css", :media => 'screen, projection'}
    - %w{opensocial-jquery jquery.livequery gadgeteer}.each do |jsfile|
      %script{:src => "/#{jsfile}.js", :type => "text/javascript"}
    %script{:type => "text/javascript"}
      == backendHost = '#{request.scheme}://#{request.host}';
    %script{:src => "/gadget.js", :type => "text/javascript"}
  %body
    .container
      #header
        %h1 Érdekelsz
      #page
      #footer
        %a{:href => "http://virgo.hu", :class => "regular"} Virgo Systems Kft.

defaults: &defaults
  module_prefs:
    title: Érdekelsz
    author: "Bácsi László, Salomváry Márton"
    author_email: bacsi.laszlo@virgo.hu
  requires:
    - opensocial-0.8
    - dynamic-height
    - settitle
    - views
    - setprefs

development:
  <<: *defaults
  appid: 1684885812

production:
  <<: *defaults
  appid: 1783065652

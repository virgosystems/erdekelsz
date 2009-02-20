<small>Sorry if you do not understand Hungarian. This is a demonstration project for a presentation we made in the Budapest New Technology Meetup about our Gadgeteer gem. That was in Hungarian so this will be too.</small>


# Érdekelsz

Az érdekelsz alkalmazás egy OpenSocial gadget. Aki felveszi az alkalmazásai közé, képes lesz más olyan emberek profilján bejelölni irántuk mutatott érdekőlését, akik szintén használják az alkalmazást. Erről addig a pillanatig csak a bejelelő személy tud, amíg valaki nem teszi meg ugyanezt viszont. Ekkor a saját profiloldalon ezt jelezzük egy másik személy profiloldalán pedig aranyos szívecskék jelennek meg.

## Implementáció

Az alkalmazás a [Sinatra](http://www.sinatrarb.com/) rubys webframeworköt és a [Gadgeteer](http://github.com/virgo/gadgeteer) gemet használja.

A fejlesztés a Gadgeteer gemmel a következő lépésekből áll:

* saját app layout kialakítása

@@@ shell
$ rails my_gadget           # Rails alkalmazás
$ echo "require 'sinatra'"  # Sinatra alkalmazás :)
@@@

* gadgeteer generátor futattása

@@@ shell
$ # az alkalmazás könyvtárában
$ gadgeteer --rails Gadget    # Rails
$ gadgeteer --sinatra Gadget  # Sinatra
@@@

* `config/gadget.yml` szerkesztése (saját app title, author és email)
* model, controller és view rétegek megírása
* ...
* PROFIT

## Model

A [model.rb](v0.1/model.rb) fájl a kapcsolatok követésének egy nagyon egyszerű megvalósítása. [DataMapper](http://www.datamapper.org/doku.php)-t használ, mivel így nincs szükség külön db migráló szkriptekre. Egyszerűség kedvéért SQLite-ot használunk az adatok tárolására.

Két egyszerű modellünk van. A [Profile](v0.1/model.rb#L5-19) modell tartalmazza a profil azonosítóját (valami `"sandbox.iwiw.hu:phSgVVot2x"`-hez hasonló iWiW sandbox esetén), valamint a felhasználó nevét és profiloldal URL-jét. Ez utóbbi kettő a linkek kirakásához kell majd.

Az [Interest](v0.1/model.rb#L21-29) modell pedig a kapcsolótábla az érdeklődő (`profile_id`) és az érdekelt (`interested_in_id`) személy között. Itt a DataMapper egy újabb előnye is megmutatkozik az ActiveRecord-dal szemben, mégpedig, hogy itt lehet összetett kulcsokkal dolgozni.

A `Profile` modell a kapcsolatok ellenőrzésére még két `has n :through` relációt is bevezet. Ezzel az, hogy az owner bejelölte-e az aktuális viewer felhasználót ílyen egyszerű ellenőrzéssé válik:

@@@ ruby
@viewer.marked_profiles.include?(@owner)
@@@

A modellek definiálása után lövünk egy `auto_upgrade!`-et, hogy az alkalmazás indulásakor biztosan szinkronba kerüljön az adatbázis a modellünkkel.

## Controller

Van benne [gadget.xml gyártás](v0.1/erdekelsz.rb#L14-17), [signed request ellenőrzés](v0.1/erdekelsz.rb#L25-29), [owner bejelölés](v0.1/erdekelsz.rb#L46-51), meg egyéb dolgok. Majd lesz rendes leírás is, ha lesz több időm.

## View

Coming soon.

## Javascript

A lényeg, és ami alig lehetne egyszerűbb. Erről is írok majd még. :)

## Fork Me!

Ha kísérletezgetni akarsz nyugodtan használd ezt a repositoryt alapul. Forkold GitHub-on, vagy töltsd le és kísérletezgess vele. Ehhez az alábbi dolgok kellenek:

@@@ shell
$ gem install sinatra dm-core do_sqlite3
$ gem install gadgeteer --source http://ruby.virgo.hu/gems/
@@@

(c) Copyright 2009 Virgo Systems Kft., released under the MIT license

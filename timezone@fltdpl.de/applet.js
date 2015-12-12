const UUID = "worldtime@fltdpl.de";
const Applet = imports.ui.applet;
const Util = imports.misc.util;
const Settings = imports.ui.settings;
const Cinnamon = imports.gi.Cinnamon;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const FileUtils = imports.misc.fileUtils;
const GLib = imports.gi.GLib;
const AppletDir = imports.ui.appletManager.appletMeta[UUID].path;
imports.searchPath.unshift(AppletDir);
const Moment = imports.momentTZ;


function TimeZoneClockApplet(metadata, orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
}


TimeZoneClockApplet.prototype = {
    __proto__: Applet.TextApplet.prototype,

    _init: function(metadata, orientation, panel_height, instance_id) {
        Applet.TextApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this.set_applet_label('loading...');

        this.instance_id = instance_id;
        this.uuid = metadata['uuid'];
        this._preferences = {};
        this.init_settings();
        this.update();



    },

    init_settings: function() {
      this.settings = new Settings.AppletSettings(
        this._preferences, this.uuid, this.instance_id);

      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        'timezone',
        '_timezone',
        this.on_setting_changed,
        null);

      },


    update: function() {

      let now = Moment.moment().tz(this._preferences._timezone);
      let time2 = now.format('HH:mm');

      this.set_applet_label(
        this._preferences._timezone.toString() + ': ' + time2);
      Mainloop.timeout_add(1000, Lang.bind(this, this.update));

    },

};


function main(metadata, orientation, panel_height, instance_id) {

    let myApplet = new TimeZoneClockApplet(metadata, orientation, panel_height, instance_id);

    return myApplet;
}

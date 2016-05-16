var makeGenericChildrenObject = function(item, ref) {
  if ((item.name || '') != '') {
    if (item.children && item.children.length > 0) {
      ref[item.name] = {};
      item.children.forEach(function(child) {
        console.log('adding ref for child ' + child.name);
        makeGenericChildrenObject(child, ref[item.name]);
      })
    } else {
      ref[item.name] = item.value;
    }
  }
};

var GenericItem = function() {
  var self = this;
  self.name = ko.observable();
  self.value = ko.observable();
  self.removed = ko.observable(false);

  self._children = ko.observableArray([]);

  self.children = ko.computed(function() {
    return self._children()
      .filter(function(child) {
        return !child.removed()
      });
  });
  self.addChild = function() {
    self._children.push(new GenericItem());
  };

  self.remove = function() {
    self.removed(true);
  }
};
var IntegrationItem = function() {
  var self = this;
  self.name = ko.observable();
  self.included = ko.observable('yes');
  self.removed = ko.observable(false);

  self.remove = function() {
    self.removed(true);
  }

  self.jsify = function() {
    return {
      name: self.name(),
      included: self.included() == 'yes'
    }
  };
  return self;
};

var Integrations = function() {
  var self = this;
  self._integrationItems = ko.observableArray([]);
  self.integrationItems = ko.computed(function() {
    return self._integrationItems()
      .filter(function(item) {
        return !item.removed();
      });
  });

  self.addIntegrationItem = function() {
    console.log('hello');
    self._integrationItems.push(new IntegrationItem());
  };

  self.jsify = function() {
    if(self.integrationItems().length == 0){
      return null;
    }
    var temp = self.integrationItems()
      .reduce(function(accumulator, integration) {
        accumulator[integration.name()] = integration.included() == 'yes';
        return accumulator;
      }, {})
    return temp;
  };
};

var Properties = function() {
  var self = this;
  self.name = ko.observable();
  self.path = ko.observable();
  self.referrer = ko.observable();
  self.search = ko.observable();
  self.title = ko.observable();
  self.url = ko.observable();

  self._children = ko.observableArray([]);

  self.children = ko.computed(function() {
    return self._children()
      .filter(function(child) {
        return !child.removed()
      });
  });

  self.addChild = function() {
    self._children.push(new GenericItem());
  };

  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.jsify;
    delete temp.addChild;
    delete temp.children;
    delete temp._children;
    var empty = Object.keys(temp)
      .reduce(function(accumulator, key) {
        return accumulator && (!temp[key] || temp[key] == '');
      }, true);
    if (self.children()
      .length == 0 && empty) {
      return null;
    } else {
      if (self.children()
        .length > 0) {
        ko.toJS(self.children)
          .forEach(function(child) {
            makeGenericChildrenObject(child, temp);
          })
      }
      return temp;
    }
  };
};

var Traits = function() {
  var self = this;

  self.age = ko.observable();
  self.avatar = ko.observable();
  self.birthday = ko.observable();
  self.createdAt = ko.observable();
  self.sentAt = ko.observable();
  self.description = ko.observable();
  self.email = ko.observable();
  self.firstName = ko.observable();
  self.gender = ko.observable();
  self.id = ko.observable();
  self.lastName = ko.observable();
  self.name = ko.observable();
  self.phone = ko.observable();
  self.title = ko.observable();
  self.username = ko.observable();
  self.website = ko.observable();

  self._children = ko.observableArray([]);
  self.children = ko.computed(function() {
    return self._children()
      .filter(function(child) {
        return !child.removed()
      });
  });

  self.addChild = function() {
    self._children.push(new GenericItem());
  };


  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.jsify;
    delete temp.addChild;
    delete temp.children;
    delete temp._children;
    var empty = Object.keys(temp)
      .reduce(function(accumulator, key) {
        return accumulator && (!temp[key] || temp[key] == '');
      }, true);
    if (self.children()
      .length == 0 && empty) {
      return null;
    } else {
      if (self.children()
        .length > 0) {
        ko.toJS(self.children)
          .forEach(function(child) {
            makeGenericChildrenObject(child, temp);
          })
      }
      return temp;
    }
  };

  return self;
};

//{{{ context children

var jsifyHelper = function(temp) {
  delete temp.jsify;
  var empty = Object.keys(temp)
    .reduce(function(accumulator, key) {
      return accumulator && (!temp[key] || temp[key] == '');
    }, true);
  if (empty) {
    return null;
  }
  return temp;
};

var App = function() {
  var self = this;
  self.name = ko.observable();
  self.version = ko.observable();
  self.build = ko.observable();

  self.jsify = function() {
    console.log('app jsify called');
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Campaign = function() {
  var self = this;
  self.name = ko.observable();
  self.source = ko.observable();
  self.medium = ko.observable();
  self.term = ko.observable();
  self.content = ko.observable();

  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Device = function() {
  var self = this;
  self.id = ko.observable();
  self.manufacturer = ko.observable();
  self.model = ko.observable();
  self.name = ko.observable();
  self.type = ko.observable();
  self.version = ko.observable();

  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Library = function() {
  var self = this;
  self.name = ko.observable();
  self.version = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
}
var Location = function() {
  var self = this;
  self.city = ko.observable();
  self.country = ko.observable();
  self.latitude = ko.observable();
  self.longitude = ko.observable();
  self.region = ko.observable();
  self.speed = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Network = function() {
  var self = this;
  self.bluetooth = ko.observable();
  self.carrier = ko.observable();
  self.cellular = ko.observable();
  self.wifi = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var OperatingSystem = function() {
  var self = this;
  self.name = ko.observable();
  self.version = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Page = function() {
  var self = this;
  self.hash = ko.observable();
  self.path = ko.observable();
  self.referrer = ko.observable();
  self.search = ko.observable();
  self.title = ko.observable();
  self.url = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Referrer = function() {
  var self = this;
  self.type = ko.observable();
  self.name = ko.observable();
  self.url = ko.observable();
  self.link = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
var Screen = function() {
  var self = this;
  self.density = ko.observable();
  self.height = ko.observable();
  self.width = ko.observable();
  self.jsify = function() {
    return jsifyHelper(ko.toJS(self));
  };
  return self;
};
//}}}

var Context = function() {
  var self = this;

  self.active = ko.observable();
  self.app = ko.observable(new App());
  self.campaign = ko.observable(new Campaign());
  self.device = ko.observable(new Device());
  self.ip = ko.observable();
  self.library = ko.observable(new Library());
  self.locale = ko.observable();
  self.location = ko.observable(new Location());
  self.network = ko.observable(new Network());
  self.os = ko.observable(new OperatingSystem());
  self.page = ko.observable(new Page());
  self.referrer = ko.observable(new Referrer());
  self.screen = ko.observable(new Screen());
  self.timezone = ko.observable();
  self.userAgent = ko.observable();
  self.traits = ko.observable(new Traits());

  self.jsify = function() {
    var temp = {
      active: self.active(),
      app: self.app()
        .jsify(),
      campaign: self.campaign()
        .jsify(),
      device: self.device()
        .jsify(),
      ip: self.ip(),
      library: self.library()
        .jsify(),
      locale: self.locale(),
      location: self.location()
        .jsify(),
      network: self.network()
        .jsify(),
      os: self.os()
        .jsify(),
      page: self.page()
        .jsify(),
      referrer: self.referrer()
        .jsify(),
      screen: self.screen()
        .jsify(),
      timezone: self.timezone(),
      userAgent: self.userAgent(),
      traits: self.traits()
        .jsify()
    };
    var empty = Object.keys(temp)
      .reduce(function(accumulator, key) {
        return accumulator && (!temp[key] || temp[key] == '');
      }, true);
    if (empty) {
      return null;
    }
    return temp;
  };

  return self;
};



var Request = function() {
  console.log('making request');
  var self = this;

  self.anonymousId = ko.observable();
  self.userId = ko.observable();
  self.channel = ko.observable();
  self.messageId = ko.observable();
  self.receivedAt = ko.observable();
  self.sentAt = ko.observable();
  self.version = ko.observable();

  //temporarily require anonymousid for testing
  self.anonymousId.extend({
    required: {
      message: ''
    }
  })

  self.context = ko.observable(new Context());
  self.integrations = ko.observable(new Integrations());

  return self;
};

var IdentifyRequest = function() {
  console.log('making identify request');
  var self = new Request();

  self.traits = ko.observable(new Traits());
  
  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.traits;
    delete temp.context;
    delete temp.integrations;
    delete temp.jsify;

    temp.traits = self.traits()
      .jsify();

    temp.context = self.context()
      .jsify();

    temp.integrations = self.integrations()
      .jsify();
    return temp;
  };
  return self;
};

var TrackRequest = function() {
  console.log('making tracking request');
  var self = new Request();
  
  self.properties = ko.observable(new Properties());
  self.event = ko.observable();

  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.context;
    delete temp.integrations;
    delete temp.properties;
    delete temp.jsify;

    temp.context = self.context()
      .jsify();

    temp.properties = self.properties()
      .jsify();

    temp.integrations = self.integrations()
      .jsify();
    return temp;
  };
  return self;
};

var PageRequest = function() {
  console.log('making page request');
  var self = new Request();
  
  self.properties = ko.observable(new Properties());
  self.category = ko.observable();
  self.name = ko.observable();

  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.context;
    delete temp.integrations;
    delete temp.properties;
    delete temp.jsify;

    temp.context = self.context()
      .jsify();

    temp.properties = self.properties()
      .jsify();

    temp.integrations = self.integrations()
      .jsify();
    return temp;
  };
  return self;
};

var GroupRequest = function() {
  console.log('making group request');
  var self = new Request();

  self.traits = ko.observable(new Traits());

  self.groupId = ko.observable();
  
  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.traits;
    delete temp.context;
    delete temp.integrations;
    delete temp.jsify;

    temp.traits = self.traits()
      .jsify();

    temp.context = self.context()
      .jsify();

    temp.integrations = self.integrations()
      .jsify();
    return temp;
  };
  return self;
};

var AliasRequest = function(){
  console.log('making alias request');
  var self = new Request();
  self.previousId = ko.observable();

  self.jsify = function() {
    var temp = ko.toJS(self);
    delete temp.traits;
    delete temp.context;
    delete temp.integrations;
    delete temp.jsify;

    temp.context = self.context()
      .jsify();

    temp.integrations = self.integrations()
      .jsify();
    return temp;
  };
  return self;
};

var RawRequest = function(panel){
  var self=this;
  self.request = ko.observable();
  self.response = ko.observable('ready.');
  var parsed;
  self.submit = function(){
    try{
      parsed = JSON.parse(self.request());
    }catch(e){
      self.response('Please ensure your request is valid JSON.');
      return;
    }
    if(!parsed.type){
      self.response('Request does not have a request type.');
    }

    var type = parsed.type;
    delete parsed.type;

    console.log(parsed);

  };

  return self;
};




var PanelModel = function() {
  var self = this;

  self.language = ko.observable('nodejs');
  self.method = ko.observable('raw');

  self.response = ko.observable('ready.');

  self.identify = ko.observable(new IdentifyRequest());
  self.track = ko.observable(new TrackRequest());
  self.page = ko.observable(new PageRequest());
  self.group = ko.observable(new GroupRequest());
  self.alias = ko.observable(new AliasRequest());
  self.raw = ko.observable(new RawRequest(self));

  self.submit = function() {
    console.log(self[self.method()]()
      .jsify());
  };

  return self;
};

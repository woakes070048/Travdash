import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Trips from './collection.js';

/**
 * @summary trips config namespace
 * @type {Object}
 */
Trips.config = {};

Trips.config.STATUS_PENDING = 1;
Trips.config.STATUS_APPROVED = 2;
Trips.config.STATUS_REJECTED = 3;
Trips.config.STATUS_SPAM = 4;
Trips.config.STATUS_DELETED = 5;

Trips.formGroups = {
  admin: {
    name: "admin",
    order: 2
  }
};

// check if user can create a new trip
const canInsert = user => Users.canDo(user, "trips.new");

// check if user can edit a trip
const canEdit = Users.canEdit;

// check if user can edit *all* trips
const canEditAll = user => Users.canDo(user, "trips.edit.all");

/**
 * @summary Trips schema
 * @type {SimpleSchema}
 */
Trips.schemaJSON = {
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    publish: true
  },
  /**
    Timetstamp of trip creation
  */
  createdAt: {
    type: Date,
    optional: true,
    publish: true // publish so that admins can sort pending trips by createdAt
  },
  /**
    Timestamp of trip first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    optional: true,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    publish: true,
    control: "datetime",
    group: Trips.formGroups.admin
  },
  /**
    Timestamp of trip start date
  */
  tripStart: {
    type: Date,
    optional: true,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    publish: true,
    control: "datetime"
  },
  /**
    Timestamp of trip end date
  */
  tripEnd: {
    type: Date,
    optional: true,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    publish: true,
    control: "datetime"
  },
  /**
    Name
  */
  name: {
    type: String,
    optional: false,
    max: 500,
    insertableIf: canInsert,
    editableIf: canEdit,
    control: "text",
    publish: true,
    order: 20
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true,
    publish: true,
  },
  /**
    Trip body (markdown)
  */
  description: {
    type: String,
    optional: true,
    max: 3000,
    insertableIf: canInsert,
    editableIf: canEdit,
    control: "textarea",
    publish: true,
    order: 30
  },
  /**
    HTML version of the trip body
  */
  htmlBody: {
    type: String,
    optional: true,
    publish: true,
  },
  /**
   Trip Excerpt
   */
  excerpt: {
    type: String,
    optional: true,
    max: 255, //should not be changed the 255 is max we should load for each trip/item
    publish: true,
  },
  /**
    Count of how many times the trip's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 0
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true,
    publish: true,
  },
  /**
    Count of how many times the trip's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 0
  },
  /**
    The trip's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    control: "select",
    publish: true,
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Users.findOne(this.userId);
      if (this.isInsert && !this.isSet)
        return Trips.getDefaultStatus(user);
    },
    form: {
      noselect: true,
      options: Telescope.statuses,
      group: 'admin'
    },
    group: Trips.formGroups.admin
  },
  /**
    Whether a trip is scheduled in the future or not
  */
  isFuture: {
    type: Boolean,
    optional: true,
    publish: true
  },
  /**
    Whether the trip is sticky (pinned to the top of trip lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    control: "checkbox",
    publish: true,
    group: Trips.formGroups.admin
  },
  /**
    Whether the trip is inactive. Inactive trips see their score recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    publish: false,
    defaultValue: false
  },
  /**
    Save info for later spam checking on a trip. We will use this for the akismet package
  */
  userIP: {
    type: String,
    optional: true,
    publish: false
  },
  userAgent: {
    type: String,
    optional: true,
    publish: false
  },
  referrer: {
    type: String,
    optional: true,
    publish: false
  },
  /**
    The trip author's name
  */
  author: {
    type: String,
    optional: true,
    publish: true,
  },
  /**
    The trip author's `_id`.
  */
  userId: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Id,
    // insertableIf: canEditAll,
    // editableIf: canEditAll,
    control: "select",
    publish: true,
    form: {
      group: 'admin',
      options: function () {
        return Users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    },
    join: {
      joinAs: "user",
      collection: () => Users
    }
  }
};

if (typeof SimpleSchema !== "undefined") {
  Trips.schema = new SimpleSchema(Trips.schemaJSON);
  Trips.attachSchema(Trips.schema);
}

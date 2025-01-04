import configOptions from "@config";
import type { NotifData } from "@notification";
import { getUrgency } from "@notification";
import { Gtk } from "astal/gtk3";

const ContentPreview = ({
  notifData: { notifObject, expanded },
}: {
  notifData: NotifData;
}) => {
  const body = notifObject.get_body();
  const urgency = getUrgency(notifObject);
  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      transitionDuration={configOptions.animations.durationSmall}
      revealChild={true}
      setup={self =>
        self.hook(expanded, (self) => {
          self.set_reveal_child(!expanded.get());
        })}
    >
      <label
        xalign={0}
        className={`txt-smallie notif-body-${urgency}`}
        useMarkup={true}
        justify={Gtk.Justification.LEFT}
        maxWidthChars={1}
        truncate={true}
        label={body.split("\n")[0]}
      />
    </revealer>
  );
};

const ContentExpanded = ({
  notifData: { notifObject, expanded },
}: {
  notifData: NotifData;
}) => {
  const body = notifObject.get_body();
  const urgency = getUrgency(notifObject);
  const actions = notifObject.get_actions();
  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      transitionDuration={configOptions.animations.durationSmall}
      revealChild={false}
      setup={self =>
        self.hook(expanded, (self) => {
          self.set_reveal_child(expanded.get());
        })}
    >
      <box vertical={true} className="spacing-v-10">
        <label
          xalign={0}
          className={`txt-smallie notif-body-${urgency}`}
          useMarkup={true}
          justify={Gtk.Justification.LEFT}
          maxWidthChars={1}
          wrap={true}
          label={body}
        />
        <box className="notif-actions spacing-h-5">
          <button
            hexpand={true}
            className={`notif-action notif-action-${urgency}`}
            onClick={() => {
              notifObject.dismiss();
            }}
          >
            <label label="Close" />
          </button>
          {...actions.map(action => (
            <button
              hexpand={true}
              className={`notif-action notif-action-${urgency}`}
              onClick={() => {
                notifObject.invoke(action.id);
              }}
            >
              <label label={action.label} />
            </button>
          ))}
        </box>
      </box>
    </revealer>
  );
};

export const Content = ({ notifData }: { notifData: NotifData }) => {
  return (
    <box vertical={true} valign={Gtk.Align.CENTER} hexpand={true}>
      <ContentPreview notifData={notifData} />
      <ContentExpanded notifData={notifData} />
    </box>
  );
};

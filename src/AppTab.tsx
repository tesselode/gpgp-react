import React from 'React';

export default abstract class AppTab<P = {}, S = {}> extends React.Component<P, S> {
	abstract save(saveAs?: boolean, onSave?: () => void);
	abstract exit(onExit: () => void);
}

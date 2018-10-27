import React from 'React';

export default abstract class AppTab<P = {}, S = {}> extends React.Component<P, S> {
	public abstract save(saveAs?: boolean, onSave?: () => void);
	public abstract exit(onExit: () => void);
}

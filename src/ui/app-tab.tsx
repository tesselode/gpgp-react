import React from 'React';

/**
 * A tab containing a main screen in GPGP.
 */
export default abstract class AppTab<P = {}, S = {}> extends React.Component<P, S> {
	/**
	 * Saves the content that is being edited in the tab.
	 * @param saveAs Whether the data should be saved to a new destination.
	 * @param onSave A function that is executed when the save occurs.
	 */
	public abstract save(saveAs?: boolean, onSave?: () => void);

	/**
	 * Requests the tab to exit.
	 * @param onExit A function that is executed when the tab is ready to exit.
	 */
	public abstract exit(onExit: () => void);
}

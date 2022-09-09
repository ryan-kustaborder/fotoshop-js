/* 
    Thank you to This Dot Labs for providing an amazing explanation for React Contexts
    https://www.thisdot.co/blog/creating-a-global-state-with-react-hooks
*/

export const reducer = (state, action) => {
    switch (action.type) {
        case "toggle_button":
            return {
                ...state,
                active: !state.active,
            };

        default:
            return state;
    }
};

export const initialState = {
    active: false,
};

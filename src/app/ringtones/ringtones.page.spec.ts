const ringtonesPage = require('./ringtones.page');

describe('RingtonesPage', () => {
    beforeEach(() => {
        window.location.reload = jest.fn();
    });

    it('should call window.location.reload on doRefresh', () => {
        const page = new ringtonesPage();
        page.doRefresh();
        expect(window.location.reload).toHaveBeenCalled();
    });
});
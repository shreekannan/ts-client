/* istanbul ignore file */
export class AbortControllerStub {
    public abort() { }
}

if (!window.AbortController) {
    (window as any).AbortController = AbortControllerStub;
}

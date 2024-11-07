import { computed, effect, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  getState,
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { QuestionService } from '../forms/question.service';
import {
  ClientService,
  IClient,
  IConnect,
  IConnection,
} from '../services/client.service';
import { IUser, UserService } from '../services/user.service';

export type ConnectState = {
  user: IUser | null;
  clients: IClient[];
  clientSelected: IClient | null;
  connections: IConnection[];
};

const initialState: ConnectState = {
  user: null,
  clients: [],
  clientSelected: null,
  connections: [],
};

export const ConnectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log('[watchState]', state);
      });

      effect(() => {
        console.log('[effect]', getState(store));
      });
    },
  }),
  withComputed(({ clientSelected, user }, qs = inject(QuestionService)) => {
    const formQuestions = computed(() => {
      const requiredFields = clientSelected()?.requiredFields;

      const questions = qs
        .allQuestions(user())
        .filter((q) => requiredFields?.includes(q.key));

      return questions.sort((a, b) => a.order - b.order);
    });

    return { formQuestions };
  }),
  withMethods(
    (
      store,
      userService = inject(UserService),
      clientService = inject(ClientService)
    ) => ({
      login: rxMethod<void>(
        pipe(
          switchMap(() => {
            return userService.login().pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, (state) => ({ ...state, user }));
                },
                error: (err) => {
                  console.error(err);
                },
              })
            );
          })
        )
      ),
      fetchClients: rxMethod<void>(
        pipe(
          debounceTime(300),
          switchMap(() => {
            return clientService.getClients().pipe(
              tapResponse({
                next: (clients) =>
                  patchState(store, (state) => ({ ...state, clients })),
                error: (err) => {
                  console.error(err);
                },
              })
            );
          })
        )
      ),
      selectClient(id: number) {
        patchState(store, {
          clientSelected: store.clients().find((c) => c.id === id),
        });
      },
      updateUser: rxMethod<IUser>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((userData) => {
            const user = { ...store.user(), ...userData };
            return userService.update(user).pipe(
              tapResponse({
                next: (user) =>
                  patchState(store, (state) => ({
                    ...state,
                    user,
                    clientSelected: null,
                  })),
                error: (err) => {
                  console.error(err);
                },
              })
            );
          })
        )
      ),
      updateUserAndConnect: rxMethod<IUser>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((userData) => {
            const user = { ...store.user(), ...userData };
            return userService.update(user).pipe(
              tapResponse({
                next: (user) =>
                  patchState(store, (state) => ({
                    ...state,
                    user,
                  })),
                error: (err) => {
                  console.error(err);
                },
              }),
              switchMap((userData) => {
                return clientService
                  .connect({
                    userId: userData.id,
                    clientId: store.clientSelected()!.id,
                  })
                  .pipe(
                    tap(() => {
                      patchState(store, (state) => ({
                        ...state,
                        clientSelected: null,
                      }));
                    })
                  );
              })
            );
          })
        )
      ),
      fetchConnections: rxMethod<void>(
        pipe(
          debounceTime(300),
          switchMap(() => {
            return clientService.getConnections().pipe(
              tapResponse({
                next: (connections) =>
                  patchState(store, (state) => ({ ...state, connections })),
                error: (err) => {
                  console.error(err);
                },
              })
            );
          })
        )
      ),
      connect: rxMethod<IConnect>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((connect) => {
            return clientService.connect(connect).pipe(
              tapResponse({
                next: (connections) =>
                  patchState(store, (state) => ({
                    ...state,
                    connections: [...state.connections, connections],
                  })),
                error: (err) => {
                  console.error(err);
                },
              })
            );
          })
        )
      ),
    })
  )
);

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AvailableBudgetInput = {
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  expenditures: Array<CategoryExpenditure>;
  id: Scalars['ID'];
  name: Scalars['String'];
  permanent: Scalars['Boolean'];
  permanentUntilYearMonth?: Maybe<Scalars['String']>;
  totalExpenses: Scalars['Float'];
  yearMonth: Scalars['String'];
};


export type CategoryExpendituresArgs = {
  filter?: InputMaybe<CategoryFilterInput>;
};


export type CategoryTotalExpensesArgs = {
  filter?: InputMaybe<CategoryFilterInput>;
};

export type CategoryExpenditure = {
  __typename?: 'CategoryExpenditure';
  amount: Scalars['Float'];
  category: Category;
  currentInstallment?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  numberOfInstallments?: Maybe<Scalars['Int']>;
  permanent?: Maybe<Scalars['Boolean']>;
  permanentUntilYearMonth?: Maybe<Scalars['String']>;
  yearMonth: Scalars['String'];
};


export type CategoryExpenditureCurrentInstallmentArgs = {
  yearMonth: Scalars['String'];
};

export type CategoryFilterInput = {
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type CreateCategoryExpenditureInput = {
  amount: Scalars['Float'];
  categoryId: Scalars['String'];
  date?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  numberOfInstallments?: InputMaybe<Scalars['Int']>;
  permanent?: InputMaybe<Scalars['Boolean']>;
  permanentUntilYearMonth?: InputMaybe<Scalars['String']>;
  yearMonth: Scalars['String'];
};

export type CreateCategoryInput = {
  name: Scalars['String'];
  permanent?: InputMaybe<Scalars['Boolean']>;
  permanentUntilYearMonth?: InputMaybe<Scalars['String']>;
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type CreateMonthlyIncomingInput = {
  amount: Scalars['Float'];
  endYearMonth?: InputMaybe<Scalars['String']>;
  startYearMonth: Scalars['String'];
};

export type CreateUserInput = {
  googleId: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type MonthlyExpenseInput = {
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type MonthlyIncoming = {
  __typename?: 'MonthlyIncoming';
  amount: Scalars['Float'];
  endYearMonth?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  startYearMonth: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createCategoryExpenditure: CategoryExpenditure;
  createMonthlyIncoming: MonthlyIncoming;
  createUser: User;
  deleteCategory: Category;
  deleteCategoryExpenditure: CategoryExpenditure;
  deleteMonthlyIncoming: Scalars['Boolean'];
  signIn: User;
  signInWithIdToken: User;
  updateCategory: Category;
  updateCategoryExpenditure: CategoryExpenditure;
  updateMonthlyIncoming: MonthlyIncoming;
};


export type MutationCreateCategoryArgs = {
  data: CreateCategoryInput;
};


export type MutationCreateCategoryExpenditureArgs = {
  data: CreateCategoryExpenditureInput;
};


export type MutationCreateMonthlyIncomingArgs = {
  data: CreateMonthlyIncomingInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCategoryExpenditureArgs = {
  id: Scalars['String'];
};


export type MutationDeleteMonthlyIncomingArgs = {
  id: Scalars['String'];
};


export type MutationSignInArgs = {
  data: SignInInput;
};


export type MutationSignInWithIdTokenArgs = {
  data: SignInWithIdTokenInput;
};


export type MutationUpdateCategoryArgs = {
  data: UpdateCategoryInput;
  id: Scalars['String'];
};


export type MutationUpdateCategoryExpenditureArgs = {
  data: UpdateCategoryExpenditureInput;
  id: Scalars['String'];
};


export type MutationUpdateMonthlyIncomingArgs = {
  data: UpdateMonthlyIncomingInput;
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  availableBudget: Scalars['Float'];
  categories: Array<Category>;
  category: Category;
  me: User;
  monthlyIncoming: MonthlyIncoming;
  monthlyIncomings: Array<MonthlyIncoming>;
  signIn: User;
  signInWithIdToken: User;
  totalMonthlyExpenses: Scalars['Float'];
  totalMonthlyIncomings: Scalars['Float'];
};


export type QueryAvailableBudgetArgs = {
  filter: AvailableBudgetInput;
};


export type QueryCategoriesArgs = {
  filter?: InputMaybe<CategoryFilterInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['String'];
};


export type QueryMonthlyIncomingArgs = {
  id: Scalars['String'];
};


export type QueryMonthlyIncomingsArgs = {
  yearMonth: Scalars['String'];
};


export type QuerySignInArgs = {
  data: SignInInput;
};


export type QuerySignInWithIdTokenArgs = {
  data: SignInWithIdTokenInput;
};


export type QueryTotalMonthlyExpensesArgs = {
  filter: MonthlyExpenseInput;
};


export type QueryTotalMonthlyIncomingsArgs = {
  yearMonth: Scalars['String'];
};

export type SignInInput = {
  googleId: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type SignInWithIdTokenInput = {
  googleId: Scalars['String'];
  idToken: Scalars['String'];
};

export type UpdateCategoryExpenditureInput = {
  amount?: InputMaybe<Scalars['Float']>;
  categoryId?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  numberOfInstallments?: InputMaybe<Scalars['Int']>;
  permanent?: InputMaybe<Scalars['Boolean']>;
  permanentUntilYearMonth?: InputMaybe<Scalars['String']>;
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  name?: InputMaybe<Scalars['String']>;
  permanent?: InputMaybe<Scalars['Boolean']>;
  permanentUntilYearMonth?: InputMaybe<Scalars['String']>;
  yearMonth?: InputMaybe<Scalars['String']>;
};

export type UpdateMonthlyIncomingInput = {
  amount?: InputMaybe<Scalars['Float']>;
  endYearMonth?: InputMaybe<Scalars['String']>;
  startYearMonth?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  googleId: Scalars['String'];
  id: Scalars['ID'];
};

export type CreateCategoryExpenditureMutationVariables = Exact<{
  data: CreateCategoryExpenditureInput;
  yearMonth: Scalars['String'];
}>;


export type CreateCategoryExpenditureMutation = { __typename?: 'Mutation', createCategoryExpenditure: { __typename?: 'CategoryExpenditure', id: string, description?: string | null, amount: number, date?: any | null, numberOfInstallments?: number | null, currentInstallment?: number | null } };

export type CreateCategoryMutationVariables = Exact<{
  data: CreateCategoryInput;
  yearMonth: Scalars['String'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string, name: string, yearMonth: string, totalExpenses: number } };

export type DeleteCategoryExpenditureMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCategoryExpenditureMutation = { __typename?: 'Mutation', deleteCategoryExpenditure: { __typename?: 'CategoryExpenditure', id: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', id: string } };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String'];
  yearMonth: Scalars['String'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category: { __typename?: 'Category', id: string, name: string, totalExpenses: number, expenditures: Array<{ __typename?: 'CategoryExpenditure', id: string, description?: string | null, amount: number, date?: any | null, numberOfInstallments?: number | null, currentInstallment?: number | null }> } };

export type GetMonthlySummaryQueryVariables = Exact<{
  yearMonth: Scalars['String'];
}>;


export type GetMonthlySummaryQuery = { __typename?: 'Query', totalMonthlyIncomings: number, totalMonthlyExpenses: number, availableBudget: number, categories: Array<{ __typename?: 'Category', id: string, yearMonth: string, name: string, totalExpenses: number }> };

export type SignInQueryVariables = Exact<{
  data: SignInWithIdTokenInput;
}>;


export type SignInQuery = { __typename?: 'Query', signInWithIdToken: { __typename?: 'User', id: string } };


export const CreateCategoryExpenditureDocument = gql`
    mutation CreateCategoryExpenditure($data: CreateCategoryExpenditureInput!, $yearMonth: String!) {
  createCategoryExpenditure(data: $data) {
    id
    description
    amount
    date
    numberOfInstallments
    currentInstallment(yearMonth: $yearMonth)
  }
}
    `;
export type CreateCategoryExpenditureMutationFn = Apollo.MutationFunction<CreateCategoryExpenditureMutation, CreateCategoryExpenditureMutationVariables>;

/**
 * __useCreateCategoryExpenditureMutation__
 *
 * To run a mutation, you first call `useCreateCategoryExpenditureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryExpenditureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryExpenditureMutation, { data, loading, error }] = useCreateCategoryExpenditureMutation({
 *   variables: {
 *      data: // value for 'data'
 *      yearMonth: // value for 'yearMonth'
 *   },
 * });
 */
export function useCreateCategoryExpenditureMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryExpenditureMutation, CreateCategoryExpenditureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryExpenditureMutation, CreateCategoryExpenditureMutationVariables>(CreateCategoryExpenditureDocument, options);
      }
export type CreateCategoryExpenditureMutationHookResult = ReturnType<typeof useCreateCategoryExpenditureMutation>;
export type CreateCategoryExpenditureMutationResult = Apollo.MutationResult<CreateCategoryExpenditureMutation>;
export type CreateCategoryExpenditureMutationOptions = Apollo.BaseMutationOptions<CreateCategoryExpenditureMutation, CreateCategoryExpenditureMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($data: CreateCategoryInput!, $yearMonth: String!) {
  createCategory(data: $data) {
    id
    name
    yearMonth
    totalExpenses(filter: {yearMonth: $yearMonth})
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      data: // value for 'data'
 *      yearMonth: // value for 'yearMonth'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const DeleteCategoryExpenditureDocument = gql`
    mutation DeleteCategoryExpenditure($id: String!) {
  deleteCategoryExpenditure(id: $id) {
    id
  }
}
    `;
export type DeleteCategoryExpenditureMutationFn = Apollo.MutationFunction<DeleteCategoryExpenditureMutation, DeleteCategoryExpenditureMutationVariables>;

/**
 * __useDeleteCategoryExpenditureMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryExpenditureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryExpenditureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryExpenditureMutation, { data, loading, error }] = useDeleteCategoryExpenditureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryExpenditureMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryExpenditureMutation, DeleteCategoryExpenditureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryExpenditureMutation, DeleteCategoryExpenditureMutationVariables>(DeleteCategoryExpenditureDocument, options);
      }
export type DeleteCategoryExpenditureMutationHookResult = ReturnType<typeof useDeleteCategoryExpenditureMutation>;
export type DeleteCategoryExpenditureMutationResult = Apollo.MutationResult<DeleteCategoryExpenditureMutation>;
export type DeleteCategoryExpenditureMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryExpenditureMutation, DeleteCategoryExpenditureMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: String!) {
  deleteCategory(id: $id) {
    id
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetCategoryDocument = gql`
    query GetCategory($id: String!, $yearMonth: String!) {
  category(id: $id) {
    id
    name
    totalExpenses
    expenditures(filter: {yearMonth: $yearMonth}) {
      id
      description
      amount
      date
      numberOfInstallments
      currentInstallment(yearMonth: $yearMonth)
    }
  }
}
    `;

/**
 * __useGetCategoryQuery__
 *
 * To run a query within a React component, call `useGetCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      yearMonth: // value for 'yearMonth'
 *   },
 * });
 */
export function useGetCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
      }
export function useGetCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
        }
export type GetCategoryQueryHookResult = ReturnType<typeof useGetCategoryQuery>;
export type GetCategoryLazyQueryHookResult = ReturnType<typeof useGetCategoryLazyQuery>;
export type GetCategoryQueryResult = Apollo.QueryResult<GetCategoryQuery, GetCategoryQueryVariables>;
export const GetMonthlySummaryDocument = gql`
    query GetMonthlySummary($yearMonth: String!) {
  totalMonthlyIncomings(yearMonth: $yearMonth)
  totalMonthlyExpenses(filter: {yearMonth: $yearMonth})
  availableBudget(filter: {yearMonth: $yearMonth})
  categories(filter: {yearMonth: $yearMonth}) {
    id
    yearMonth
    name
    totalExpenses(filter: {yearMonth: $yearMonth})
  }
}
    `;

/**
 * __useGetMonthlySummaryQuery__
 *
 * To run a query within a React component, call `useGetMonthlySummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMonthlySummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMonthlySummaryQuery({
 *   variables: {
 *      yearMonth: // value for 'yearMonth'
 *   },
 * });
 */
export function useGetMonthlySummaryQuery(baseOptions: Apollo.QueryHookOptions<GetMonthlySummaryQuery, GetMonthlySummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMonthlySummaryQuery, GetMonthlySummaryQueryVariables>(GetMonthlySummaryDocument, options);
      }
export function useGetMonthlySummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMonthlySummaryQuery, GetMonthlySummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMonthlySummaryQuery, GetMonthlySummaryQueryVariables>(GetMonthlySummaryDocument, options);
        }
export type GetMonthlySummaryQueryHookResult = ReturnType<typeof useGetMonthlySummaryQuery>;
export type GetMonthlySummaryLazyQueryHookResult = ReturnType<typeof useGetMonthlySummaryLazyQuery>;
export type GetMonthlySummaryQueryResult = Apollo.QueryResult<GetMonthlySummaryQuery, GetMonthlySummaryQueryVariables>;
export const SignInDocument = gql`
    query SignIn($data: SignInWithIdTokenInput!) {
  signInWithIdToken(data: $data) {
    id
  }
}
    `;

/**
 * __useSignInQuery__
 *
 * To run a query within a React component, call `useSignInQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignInQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignInQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignInQuery(baseOptions: Apollo.QueryHookOptions<SignInQuery, SignInQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignInQuery, SignInQueryVariables>(SignInDocument, options);
      }
export function useSignInLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignInQuery, SignInQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignInQuery, SignInQueryVariables>(SignInDocument, options);
        }
export type SignInQueryHookResult = ReturnType<typeof useSignInQuery>;
export type SignInLazyQueryHookResult = ReturnType<typeof useSignInLazyQuery>;
export type SignInQueryResult = Apollo.QueryResult<SignInQuery, SignInQueryVariables>;
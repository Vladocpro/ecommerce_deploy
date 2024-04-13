export type User = {
   id:            string,
   email?:         string,
   password?:      string,
   orders:        string[],
   favorites:     Product[],
   cart:          Product[],
   createdAt:     Date,
   updatedAt:     Date,
}

export type Product = {
   id          :string,
   title       :string,
   description :string,
   price       :number
   sizes       :{title: string, quantity: number}[],
   images      :string[],
   category    :String,
   gender      :string,
   sale        :number,
   quantity?   :number,
   size?       :number
}
export type Order = {
   id              :String
   tracking_number :String
   userId          :String
   paymentIntent   :String
   sessionId       :String
   currency        :String
   customerName    :String
   customerEmail   :String
   items           :any[]
   amountSubtotal  :number
   shipping        :number
   amountTotal     :number
   date            :String
}
export type LoginForm = {
   email: string,
   password: string,
   repPassword: string
}
export type Auth = {
   email: string,
   password: string,
}
export type IFiltersState = {
   sortBy: string |null,
   search: string |null,
   sale: boolean,
   price: string[],
   category: string[],
   gender: string[],
   sizes: string[],
};

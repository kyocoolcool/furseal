create table if not exists bill_id
(
    next_val bigint null
);

create table if not exists members
(
    member_id bigint auto_increment
    primary key,
    name      varchar(20) not null,
    salary    int         null,
    guild     varchar(20) not null
    );

create table if not exists products
(
    product_id bigint auto_increment
    primary key,
    name       varchar(20) null,
    price      int         null
    );

create table if not exists bills
(
    bill_id          bigint      not null
    primary key,
    buyer            int         null,
    deleted          bit         null,
    gain_time        datetime(6) null,
    gainer           int         null,
    money            int         null,
    status           int         null comment '0:販售中
1:完成交易
2:競標中
3:尚未販售',
    transaction_time datetime(6) null,
    way              char        null comment '0:交易所
1:玩家交易
2:尚未交易',
    product_id       bigint      not null,
    tax              int         null,
    fee              int         null,
    constraint FKja2jdwvsth2hkvlk8k334i822
    foreign key (product_id) references products (product_id)
    );

create table if not exists bill_member
(
    bill_id   bigint not null,
    member_id bigint not null,
    constraint FK3u74jcpc8990ugq43s0equh1d
    foreign key (member_id) references members (member_id),
    constraint FKiju5hdj110u67wgjn62of2bfd
    foreign key (bill_id) references bills (bill_id)
    );


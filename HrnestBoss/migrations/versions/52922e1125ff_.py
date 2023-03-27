"""empty message

Revision ID: 52922e1125ff
Revises: 7a9057454acb
Create Date: 2022-02-06 13:55:05.743669

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52922e1125ff'
down_revision = '7a9057454acb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user2timetable', sa.Column('changes', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user2timetable', 'changes')
    # ### end Alembic commands ###
